import Notification from '../../models/data/noti.model.js'

export const getNotificationsByUserId = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit

  // Get total unread notifications
  const unreadCount = await Notification.count({
    where: { 
      userId,
      isRead: false 
    }
  })

  // Get paginated notifications
  const notifications = await Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
    offset
  })

  // Get total count for pagination
  const totalCount = await Notification.count({
    where: { userId }
  })

  return {
    notifications,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount
    },
    unreadCount
  }
}
