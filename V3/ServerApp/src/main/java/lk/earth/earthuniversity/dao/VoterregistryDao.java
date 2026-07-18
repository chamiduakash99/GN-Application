package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Voterregistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VoterregistryDao extends JpaRepository<Voterregistry, Integer> {

    // All entries ordered by household then serial number
    @Query("select v from Voterregistry v order by v.household.id, v.serialno")
    List<Voterregistry> findAllOrdered();

    // Entries for a specific household
    @Query("select v from Voterregistry v where v.household.id = :householdId order by v.serialno")
    List<Voterregistry> findByHouseholdId(Integer householdId);

    // Household summary — distinct households in registry with count
    @Query("select v.household.id, v.household.householdno, v.household.address, count(v) " +
            "from Voterregistry v group by v.household.id, v.household.householdno, v.household.address " +
            "order by v.household.householdno")
    List<Object[]> getHouseholdSummary();

    // Total voter count
    @Query("select count(v) from Voterregistry v")
    Long getTotalCount();

    // Clear all registry entries before regenerating
    @Modifying
    @Transactional
    @Query("delete from Voterregistry v")
    void clearAll();

    // Eligible citizens query — age >= 18, citizenstatus_id = 1, has household
    @Query(value =
            "SELECT c.id, c.name, c.namewithinitials, c.nic, c.dateofbirth, " +
                    "       c.mobileno, c.household_id " +
                    "FROM citizen c " +
                    "WHERE TIMESTAMPDIFF(YEAR, c.dateofbirth, CURDATE()) >= 18 " +
                    "  AND c.citizenstatus_id = 1 " +
                    "  AND c.household_id IS NOT NULL " +
                    "ORDER BY c.household_id, c.name",
            nativeQuery = true)
    List<Object[]> findEligibleCitizens();
}