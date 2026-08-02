namespace Repositry_DataAccess_.DTOs
{
    public class clsDormImageDTO
    {
        public int ImageID { get; set; }

        public string DormID { get; set; } =
            string.Empty;

        public string ImageUrl { get; set; } =
            string.Empty;

        public string PublicId { get; set; } =
            string.Empty;

        public int DisplayOrder { get; set; }

        public DateTime UploadedAt { get; set; }
    }
}