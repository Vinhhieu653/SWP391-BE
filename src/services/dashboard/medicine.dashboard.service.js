import MedicalSent from '../../models/data/medical_sent.model.js'

export const countTotalPrescriptions = () => MedicalSent.count()

export const countPendingPrescriptions = () => MedicalSent.count({ where: { Status: 'pending' } })

export const countReceivedPrescriptions = () => MedicalSent.count({ where: { Status: 'received' } })

export const countRejectedPrescriptions = () => MedicalSent.count({ where: { Status: 'rejected' } })

export const countGivenPrescriptions = () => MedicalSent.count({ where: { Status: 'given' } })
