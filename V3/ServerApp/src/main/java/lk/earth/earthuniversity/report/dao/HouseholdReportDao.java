package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HouseholdReportDao extends JpaRepository<Household, Integer> {

    @Query(value = "SELECT h.id AS householdId, COUNT(c.id) AS memberCount " +
            "FROM household h LEFT JOIN citizen c ON c.household_id = h.id " +
            "GROUP BY h.id", nativeQuery = true)
    List<Object[]> getHouseholdMemberCounts();
}