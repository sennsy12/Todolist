﻿namespace Todolist.Exceptions
{
    public class UnauthorizedAccessException : Exception
    {
        public UnauthorizedAccessException()
        {
        }

        public UnauthorizedAccessException(string message)
            : base(message)
        {
        }

        public UnauthorizedAccessException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
