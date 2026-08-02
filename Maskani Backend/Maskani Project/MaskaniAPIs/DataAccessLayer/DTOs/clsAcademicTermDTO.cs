using System;

namespace MaskaniDataAccess.DTOs
{
    public class clsAcademicTermDTO
    {
        public int TermId { get; set; }
        public string Name { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public bool IsActive { get; set; }

        public clsAcademicTermDTO(int termId, string name, DateOnly startDate, DateOnly endDate, bool isActive)
        {
            TermId = termId;
            Name = name;
            StartDate = startDate;
            EndDate = endDate;
            IsActive = isActive;
        }

        public clsAcademicTermDTO()
        {
            TermId = -1;
            Name = string.Empty;
        }
    }

    public class clsAddAcademicTermDTO
    {
        public string Name { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

        public clsAddAcademicTermDTO(string name, DateOnly startDate, DateOnly endDate)
        {
            Name = name;
            StartDate = startDate;
            EndDate = endDate;
        }

        public clsAddAcademicTermDTO()
        {
            Name = string.Empty;
        }
    }

    public class clsUpdateAcademicTermDTO
    {
        public int TermId { get; set; }
        public string Name { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public bool IsActive { get; set; }

        public clsUpdateAcademicTermDTO(int termId, string name, DateOnly startDate, DateOnly endDate, bool isActive)
        {
            TermId = termId;
            Name = name;
            StartDate = startDate;
            EndDate = endDate;
            IsActive = isActive;
        }

        public clsUpdateAcademicTermDTO()
        {
            TermId = -1;
            Name = string.Empty;
        }
    }
}