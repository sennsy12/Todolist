public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetNotificationsForUserAsync(int userId);
    Task<NotificationDto> CreateNotificationAsync(NotificationCreateDto dto);
    Task MarkAsReadAsync(int notificationId, int userId);
    Task<int> GetUnreadCountAsync(int userId);
    Task DeleteNotificationAsync(int notificationId, int userId);
} 