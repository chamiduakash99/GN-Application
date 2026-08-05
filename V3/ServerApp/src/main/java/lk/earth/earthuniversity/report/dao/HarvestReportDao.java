package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Harvest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

public interface HarvestReportDao extends JpaRepository<Harvest, Integer> {

    @Query(value = "SELECT DATE_FORMAT(h.harvestdate, '%Y-%m') AS ym, SUM(h.quantity) AS totalQty, COUNT(h.id) AS cnt " +
            "FROM harvest h " +
            "WHERE (:start IS NULL OR h.harvestdate >= :start) " +
            "AND (:end IS NULL OR h.harvestdate <= :end) " +
            "AND (:minQty IS NULL OR h.quantity >= :minQty) " +
            "AND (:maxQty IS NULL OR h.quantity <= :maxQty) " +
            "GROUP BY ym ORDER BY ym", nativeQuery = true)
    List<Object[]> getHarvestSummaryByMonth(@Param("start") Date start,
                                            @Param("end") Date end,
                                            @Param("minQty") BigDecimal minQty,
                                            @Param("maxQty") BigDecimal maxQty);
}