package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Certificaterequest;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

/**
 * Counts CERTIFICATE REQUESTS by status.
 *
 * The old query started FROM Certificate, so a request only appeared once a
 * certificate row existed for it - which meant Pending and Rejected requests
 * (which never get a certificate) could never show up in the report at all.
 * Starting from Certificaterequest and LEFT JOINing the certificate keeps the
 * "hard copy picked" filter working while making every status visible.
 */
public interface CertificateReportDao extends JpaRepository<Certificaterequest, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(rs.name, COUNT(cr.id)) " +
            "FROM Certificaterequest cr " +
            "JOIN cr.requeststatus rs " +
            "LEFT JOIN Certificate c ON c.certificaterequest = cr " +
            "WHERE (:statusId IS NULL OR rs.id = :statusId) " +
            "AND (:picked IS NULL OR c.hardcopypicked = :picked) " +
            "AND (:start IS NULL OR cr.requesteddate >= :start) " +
            "AND (:end IS NULL OR cr.requesteddate <= :end) " +
            "GROUP BY rs.id, rs.name")
    List<CountReport> countByStatus(@Param("statusId") Integer statusId,
                                    @Param("picked") Byte picked,
                                    @Param("start") Date start,
                                    @Param("end") Date end);
}
