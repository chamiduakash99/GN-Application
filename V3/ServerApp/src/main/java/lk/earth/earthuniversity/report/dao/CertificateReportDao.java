package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Certificate;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface CertificateReportDao extends JpaRepository<Certificate, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(rs.name, COUNT(c.id)) " +
            "FROM Certificate c JOIN c.certificaterequest cr JOIN cr.requeststatus rs " +
            "WHERE (:statusId IS NULL OR rs.id = :statusId) " +
            "AND (:picked IS NULL OR c.hardcopypicked = :picked) " +
            "AND (:start IS NULL OR c.issueddate >= :start) " +
            "AND (:end IS NULL OR c.issueddate <= :end) " +
            "GROUP BY rs.id, rs.name")
    List<CountReport> countByStatus(@Param("statusId") Integer statusId,
                                    @Param("picked") Byte picked,
                                    @Param("start") Date start,
                                    @Param("end") Date end);
}