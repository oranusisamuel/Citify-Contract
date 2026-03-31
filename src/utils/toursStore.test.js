import { beforeEach, describe, expect, it, vi } from 'vitest'

const firestoreMocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(() => 'tour_collection_ref'),
  serverTimestamp: vi.fn(() => 'server_ts'),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
  deleteDoc: vi.fn(),
}))

const notificationMocks = vi.hoisted(() => ({
  sendTourEmailNotification: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  addDoc: firestoreMocks.addDoc,
  collection: firestoreMocks.collection,
  serverTimestamp: firestoreMocks.serverTimestamp,
  onSnapshot: firestoreMocks.onSnapshot,
  orderBy: firestoreMocks.orderBy,
  query: firestoreMocks.query,
  updateDoc: firestoreMocks.updateDoc,
  doc: firestoreMocks.doc,
  deleteDoc: firestoreMocks.deleteDoc,
}))

vi.mock('../firebase', () => ({
  db: { name: 'db' },
}))

vi.mock('./notifications', () => ({
  sendTourEmailNotification: notificationMocks.sendTourEmailNotification,
}))

import { createTourRequest } from './toursStore'

describe('createTourRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    firestoreMocks.addDoc.mockResolvedValue({ id: 'tour_1' })
    notificationMocks.sendTourEmailNotification.mockResolvedValue({ sent: true })
  })

  it('stores canonical ISO date and sends notification payload', async () => {
    await createTourRequest({
      projectId: '100',
      projectTitle: 'Prime Estate',
      projectLocation: 'Abuja',
      tourType: 'in-person',
      date: '2026-04-06',
      time: '10:00',
      name: 'John Doe',
      phone: '+2348012345678',
      email: 'john@example.com',
      message: 'Looking to inspect this property.',
    })

    expect(firestoreMocks.addDoc).toHaveBeenCalledTimes(1)
    const payload = firestoreMocks.addDoc.mock.calls[0][1]

    expect(payload.date).toBe('2026-04-06')
    expect(payload.dateLabel).toBeTypeOf('string')
    expect(payload.status).toBe('new')
    expect(payload.createdAt).toBe('server_ts')
    expect(payload.id).toBeUndefined()

    expect(notificationMocks.sendTourEmailNotification).toHaveBeenCalledWith({
      ...payload,
      id: 'tour_1',
    })
  })

  it('does not fail the request when notification fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    notificationMocks.sendTourEmailNotification.mockRejectedValue(new Error('notification failed'))

    await expect(createTourRequest({
      projectId: '101',
      projectTitle: 'City View',
      projectLocation: 'Lagos',
      tourType: 'video',
      date: '2026-05-01',
      time: '11:00',
      name: 'Jane Doe',
      phone: '+2348098765432',
      email: 'jane@example.com',
      message: '',
    })).resolves.toBeUndefined()

    expect(firestoreMocks.addDoc).toHaveBeenCalledTimes(1)
    expect(notificationMocks.sendTourEmailNotification).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })
})
