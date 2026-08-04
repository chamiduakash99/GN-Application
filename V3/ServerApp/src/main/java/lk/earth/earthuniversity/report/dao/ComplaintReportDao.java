package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Complaint;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface ComplaintReportDao extends JpaRepository<Complaint, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(cs.name, COUNT(c.id)) " +
            "FROM Complaint c JOIN c.complaintstatus cs " +
            "WHERE (:start IS NULL OR c.complaineddate >= :start) " +
            "AND (:end IS NULL OR c.complaineddate <= :end) " +
            "AND (:statusId IS NULL OR cs.id = :statusId) " +
            "GROUP BY cs.id, cs.name")
    List<CountReport> countByStatus(@Param("start") Timestamp start,
                                    @Param("end") Timestamp end,
                                    @Param("statusId") Integer statusId);
}