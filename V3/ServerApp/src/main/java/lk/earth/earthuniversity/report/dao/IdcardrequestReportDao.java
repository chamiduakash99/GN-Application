package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Idcardrequest;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface IdcardrequestReportDao extends JpaRepository<Idcardrequest, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(s.name, COUNT(i.id)) " +
            "FROM Idcardrequest i JOIN i.idcardrequeststatus s " +
            "WHERE (:start IS NULL OR i.applieddate >= :start) " +
            "AND (:end IS NULL OR i.applieddate <= :end) " +
            "AND (:statusId IS NULL OR s.id = :statusId) " +
            "GROUP BY s.id, s.name")
    List<CountReport> countByStatus(@Param("start") Timestamp start,
                                    @Param("end") Timestamp end,
                                    @Param("statusId") Integer statusId);
}