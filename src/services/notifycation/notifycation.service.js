import Notification from '../../models/data/noti.model.js'

export const getNotificationsByUserId = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit

  const unreadCount = await Notification.count({
    where: {
      userId,
      isRead: false
    }
  })

  const notifications = await Notification.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
    offset
  })

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

export const markNotificationAsReadService = async (notificationIds) => {
  const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds]
  const [updatedCount] = await Notification.update({ isRead: true }, { where: { notiId: ids } })
  return updatedCount
}
