import { beforeEach, describe, expect, it, vi } from 'vitest'

const firestoreMocks = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(() => 'contact_collection_ref'),
  serverTimestamp: vi.fn(() => 'server_ts'),
}))

const notificationMocks = vi.hoisted(() => ({
  sendContactEmailNotification: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  addDoc: firestoreMocks.addDoc,
  collection: firestoreMocks.collection,
  serverTimestamp: firestoreMocks.serverTimestamp,
}))

vi.mock('../firebase', () => ({
  db: { name: 'db' },
}))

vi.mock('./notifications', () => ({
  sendContactEmailNotification: notificationMocks.sendContactEmailNotification,
}))

import { createContactRequest } from './contactStore'

describe('createContactRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    firestoreMocks.addDoc.mockResolvedValue({ id: 'contact_1' })
    notificationMocks.sendContactEmailNotification.mockResolvedValue({ sent: true })
  })

  it('persists contact payload and triggers email notification', async () => {
    await createContactRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'I would like more information about your listings.',
      source: 'contact-page',
    })

    expect(firestoreMocks.addDoc).toHaveBeenCalledTimes(1)
    expect(firestoreMocks.addDoc).toHaveBeenCalledWith('contact_collection_ref', {
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'I would like more information about your listings.',
      source: 'contact-page',
      status: 'new',
      createdAt: 'server_ts',
    })

    expect(notificationMocks.sendContactEmailNotification).toHaveBeenCalledWith({
      id: 'contact_1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'I would like more information about your listings.',
      source: 'contact-page',
    })
  })

  it('does not fail the request when email notification fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    notificationMocks.sendContactEmailNotification.mockRejectedValue(new Error('email failed'))

    await expect(createContactRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'I would like more information about your listings.',
      source: 'header',
    })).resolves.toBeUndefined()

    expect(firestoreMocks.addDoc).toHaveBeenCalledTimes(1)
    expect(notificationMocks.sendContactEmailNotification).toHaveBeenCalledTimes(1)

    consoleSpy.mockRestore()
  })
})
