using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaskaniDataAccessLayer.DTOs
{
    public class clsLoginRequestDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public clsLoginRequestDTO(string Email, string Password)
        {
            this.Email = Email;
            this.Password = Password;
        }
        public clsLoginRequestDTO() { }
    }
}
