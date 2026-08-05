package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizenskill;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface CitizenskillReportDao extends JpaRepository<Citizenskill, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(p.name, COUNT(cs.id), AVG(i.monthlyaverageincome)) " +
            "FROM Citizenskill cs " +
            "JOIN cs.profession p " +
            "JOIN cs.citizen c " +
            "LEFT JOIN Income i ON i.citizen = c " +
            "WHERE (:professionId IS NULL OR p.id = :professionId) " +
            "AND (:minExp IS NULL OR cs.experienceyears >= :minExp) " +
            "AND (:maxExp IS NULL OR cs.experienceyears <= :maxExp) " +
            "AND (:minIncome IS NULL OR i.monthlyaverageincome >= :minIncome) " +
            "AND (:maxIncome IS NULL OR i.monthlyaverageincome <= :maxIncome) " +
            "GROUP BY p.id, p.name")
    List<CountReport> countByProfession(@Param("professionId") Integer professionId,
                                        @Param("minExp") Integer minExp,
                                        @Param("maxExp") Integer maxExp,
                                        @Param("minIncome") BigDecimal minIncome,
                                        @Param("maxIncome") BigDecimal maxIncome);
}