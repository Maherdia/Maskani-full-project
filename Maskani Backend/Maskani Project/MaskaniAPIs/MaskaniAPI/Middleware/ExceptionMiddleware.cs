using System.Text.Json;

namespace MaskaniAPI.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (UnauthorizedAccessException ex)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status403Forbidden,
                    ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status409Conflict,
                    ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status404NotFound,
                    ex.Message);
            }
            catch (ArgumentException ex)
            {
                await WriteResponse(
                    context,
                    StatusCodes.Status400BadRequest,
                    ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                await WriteResponse(
                    context,
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred.");
            }
        }

        private static async Task WriteResponse(
            HttpContext context,
            int statusCode,
            string message)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(new
                {
                    message
                }));
        }
    }
}