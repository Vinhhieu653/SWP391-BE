import * as registerService from '../../services/auth/register.service.js'

export async function register(req, res) {
  try {
    await registerService.registerUser(req.body)
    res.status(201).json({ message: 'Registered successfully, waiting for approval' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function approve(req, res) {
  try {
    const user = await registerService.approveUser(req.params.id)
    res.status(200).json({ message: `User ${user.username} approved` })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function reject(req, res) {
  try {
    const user = await registerService.rejectUser(req.params.id)
    res.status(200).json({ message: `User ${user.username} rejected` })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await registerService.deleteUser(req.params.id)
    res.status(200).json({ message: `User ${user.username} deleted` })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await registerService.getAllUsers()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function update(req, res) {
  try {
    const user = await registerService.updateUser(req.params.id, req.body)
    res.status(200).json({ message: 'User updated', user })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
