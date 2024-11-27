using TodoList.Models;

namespace TodoList.Repositories
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetForUserAsync(int userId);
        Task<Notification> CreateAsync(Notification notification);
        Task MarkAsReadAsync(int notificationId, int userId);
        Task<int> GetUnreadCountAsync(int userId);
        Task DeleteAsync(int notificationId, int userId);
    }
} 