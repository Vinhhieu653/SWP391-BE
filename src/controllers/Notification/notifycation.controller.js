import * as NotificationService from '../../services/notifycation/notifycation.service.js'

export const getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    const notifications = await NotificationService.getNotificationsByUserId(userId, page, limit)
    res.status(200).json(notifications)
  } catch (error) {
    console.error('Error in getNotificationsByUser:', error)
    res.status(500).json({ message: error.message || 'Internal server error' })
  }
}

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    if (!notificationIds) {
      return res.status(400).json({ message: 'notificationIds is required' });
    }
    const updatedCount = await NotificationService.markNotificationAsReadService(notificationIds);
    res.status(200).json({
      message: 'Notifications marked as read',
      updatedCount
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
  }
}
