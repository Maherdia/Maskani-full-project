using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
    public class clsHashing
    {
        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }
        public static bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split(':');
            if (parts.Length != 2)
                return false; // invalid format

            var salt = Convert.FromBase64String(parts[0]);
            var storedPasswordHash = parts[1];

            var hash = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256).GetBytes(32);
            var computedHash = Convert.ToBase64String(hash);

            return storedPasswordHash == computedHash;
        }

    }
}
