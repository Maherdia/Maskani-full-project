namespace MaskaniDataAccess.DTOs
{
    public sealed class clsOwnerProfileDTO
    {
        public int OwnerID { get; set; }

        public int PersonID { get; set; }

        public string FirstName { get; set; } =
            string.Empty;

        public string LastName { get; set; } =
            string.Empty;

        public string Phone { get; set; } =
            string.Empty;

        public string Email { get; set; } =
            string.Empty;

        public string Role { get; set; } =
            "Owner";
    }
}