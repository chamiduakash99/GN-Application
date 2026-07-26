package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface IncomeDao extends JpaRepository<Income, Integer> {

    // Find income record for a specific citizen (one per citizen)
    @Query("select i from Income i where i.citizen.id = :citizenId")
    Optional<Income> findByCitizenId(Integer citizenId);

    // For server-side filtering by income source
    @Query("select i from Income i where lower(i.incomesource) like lower(concat('%', :source, '%'))")
    List<Income> findByIncomeSource(String source);
}