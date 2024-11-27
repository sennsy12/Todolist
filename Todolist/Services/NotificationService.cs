using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todolist.DTOs;
using Todolist.Exceptions;
using Todolist.Models;
using TodoList.Repositories;
using TodoList.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<IEnumerable<NotificationDto>> GetNotificationsForUserAsync(int userId)
    {
        var notifications = await _notificationRepository.GetForUserAsync(userId);
        return notifications.Select(n => new NotificationDto
        {
            Id = n.Id,
            Message = n.Message,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt,
            Type = n.Type,
            RelatedTodoId = n.RelatedTodoId
        });
    }

    public async Task<NotificationDto> CreateNotificationAsync(NotificationCreateDto dto)
    {
        var notification = new TodoList.Models.Notification
        {
            UserId = dto.UserId,
            Message = dto.Message,
            Type = dto.Type,
            RelatedTodoId = dto.RelatedTodoId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _notificationRepository.CreateAsync(notification);
        return new NotificationDto
        {
            Id = notification.Id,
            Message = notification.Message,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt,
            Type = notification.Type,
            RelatedTodoId = notification.RelatedTodoId
        };
    }

    public async Task MarkAsReadAsync(int notificationId, int userId)
    {
        await _notificationRepository.MarkAsReadAsync(notificationId, userId);
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _notificationRepository.GetUnreadCountAsync(userId);
    }

    public async Task DeleteNotificationAsync(int notificationId, int userId)
    {
        await _notificationRepository.DeleteAsync(notificationId, userId);
    }
} 