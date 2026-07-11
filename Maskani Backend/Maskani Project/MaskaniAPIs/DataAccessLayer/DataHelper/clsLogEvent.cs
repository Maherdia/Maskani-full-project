namespace DataAccessLayer.DataAccessTool
{

    //public abstract class clsLogEvent
    //{
    //    private readonly ILogger<clsLogEvent> _logger;

    //    public clsLogEvent(ILogger<clsLogEvent> logger)
    //    {
    //        _logger = logger;
    //    }

    //    public void LogException(string message, LogLevel level = LogLevel.Error)
    //    {
    //        _logger.Log(level, message);
    //    }

    //    public void LogException(Exception ex, LogLevel level = LogLevel.Error)
    //    {
    //        _logger.Log(level, ex, ex.Message);
    //    }
    //}
    //public class clsLogEvent
    //{
    //    private static string _sourceName = "MaskaniApp";
    //    ///<summary> 
    //    ///This Method For Loging Try Catch Exception From Data Access 
    //    ///</summary>
    //    ///<param name="Message"></param>
    //    ///<param name="Type"></param>
    //    public static void LogExceptionToLogViwer(string Message, EventLogEntryType type)
    //    {
    //        //create the event source if it does not exist
    //        if (!EventLog.SourceExists(_sourceName))
    //        {
    //            EventLog.CreateEventSource(_sourceName, "Application");
    //        }
    //        EventLog.WriteEntry(_sourceName, Message, type);
    //    }
    //}
}
