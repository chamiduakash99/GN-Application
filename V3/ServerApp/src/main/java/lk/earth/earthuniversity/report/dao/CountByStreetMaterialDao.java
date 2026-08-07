package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Street;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface CountByStreetMaterialDao extends JpaRepository<Street, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(sm.name, COUNT(s.id)) " +
            "FROM Street s JOIN s.streetmatierial sm GROUP BY sm.id, sm.name")
    List<CountReport> countByStreetMaterial();

    // the third argument lands in CountReport.value and is shown as Total Length
    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(sm.name, COUNT(s.id), SUM(s.length)) " +
            "FROM Street s JOIN s.streetmatierial sm " +
            "WHERE (:minLength IS NULL OR s.length >= :minLength) " +
            "AND (:maxLength IS NULL OR s.length <= :maxLength) " +
            "GROUP BY sm.id, sm.name")
    List<CountReport> countByStreetMaterial(@Param("minLength") BigDecimal minLength,
                                            @Param("maxLength") BigDecimal maxLength);

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(ss.status, COUNT(s.id), SUM(s.length)) " +
            "FROM Street s JOIN s.streetstatus ss " +
            "WHERE (:minLength IS NULL OR s.length >= :minLength) " +
            "AND (:maxLength IS NULL OR s.length <= :maxLength) " +
            "GROUP BY ss.id, ss.status")
    List<CountReport> countByStreetStatus(@Param("minLength") BigDecimal minLength,
                                          @Param("maxLength") BigDecimal maxLength);
}
