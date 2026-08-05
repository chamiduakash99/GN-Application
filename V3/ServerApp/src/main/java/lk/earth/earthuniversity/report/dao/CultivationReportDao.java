package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Cultivation;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

public interface CultivationReportDao extends JpaRepository<Cultivation, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(ct.name, COUNT(c.id), SUM(c.cultivatedarea)) " +
            "FROM Cultivation c JOIN c.croptype ct " +
            "WHERE (:statusId IS NULL OR c.cultivationstatus.id = :statusId) " +
            "AND (:start IS NULL OR c.plantingdate >= :start) " +
            "AND (:end IS NULL OR c.plantingdate <= :end) " +
            "AND (:minArea IS NULL OR c.cultivatedarea >= :minArea) " +
            "AND (:maxArea IS NULL OR c.cultivatedarea <= :maxArea) " +
            "GROUP BY ct.id, ct.name")
    List<CountReport> countByCropType(@Param("statusId") Integer statusId,
                                      @Param("start") Date start,
                                      @Param("end") Date end,
                                      @Param("minArea") BigDecimal minArea,
                                      @Param("maxArea") BigDecimal maxArea);
}