using System.Collections.Generic;
using System.Threading.Tasks;

namespace MaskaniDataAccess.Interfaces
{
    /// <summary>
    /// Generic base interface for asynchronous CRUD operations.
    /// </summary>
    /// <typeparam name="TRead">The DTO type used for reads (e.g., clsPeopleDTO).</typeparam>
    /// <typeparam name="TCreate">The DTO type used for creation (e.g., clsAddPeopleDTO).</typeparam>
    /// <typeparam name="TUpdate">The DTO type used for updates (e.g., clsUpdatePeopleDTO).</typeparam>
    public interface IBasicRepository<TRead, TCreate, TUpdate>
    {
        Task<int> AddAsync(TCreate createDTO);
        Task<TRead?> GetByIdAsync(int id);
        Task<List<TRead>> GetAllAsync();
        Task<bool> UpdateAsync(TUpdate updateDTO);
        Task<bool> DeleteAsync(int id);
    }
}
