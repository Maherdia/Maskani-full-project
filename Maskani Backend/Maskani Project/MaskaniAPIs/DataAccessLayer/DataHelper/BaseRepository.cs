using System;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Diagnostics;
using System.Threading.Tasks;
using DataAccessLayer.DataAccessTool;
//using Microsoft.Extensions.Logging;

namespace MaskaniDataAccessLayer.DataHelper
{
    public abstract class BaseRepository
    {
        protected readonly string _connectionString;
        //private readonly ILogger<BaseRepository> _logger;

        //public BaseRepository(string connectionString, ILogger<BaseRepository> logger)
        //{
        //    _connectionString = connectionString;
        //    _logger = logger ?? throw new ArgumentNullException(nameof(logger), "Logger cannot be null. Please provide a valid logger instance.");
        //}

        public BaseRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        /// <summary>
        /// Executes a stored procedure asynchronously using ADO.NET with parameter configuration and result mapping.
        /// </summary>
        /// <typeparam name="TResult">The type of result to return (e.g., object, list, scalar).</typeparam>
        /// <param name="storedProc">The name of the stored procedure.</param>
        /// <param name="configureCommand">Lambda to configure command parameters.</param>
        /// <param name="execute">Lambda to define how to handle command execution (e.g., ExecuteReaderAsync).</param>
        /// <returns>The result of the execution.</returns>
        protected async Task<TResult> ExecuteCommandAsync<TResult>(string storedProc,Action<SqlCommand> configureCommand,
            Func<SqlCommand, Task<TResult>> execute)
        {
            try
            {
                await using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                await using var command = new SqlCommand(storedProc, connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                 configureCommand(command);
                return await execute(command);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
