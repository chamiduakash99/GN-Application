package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Announcement;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

public interface AnnouncementReportDao extends JpaRepository<Announcement, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(" +
            "CASE WHEN a.isactive = 1 THEN 'Active' ELSE 'Inactive' END, COUNT(a.id)) " +
            "FROM Announcement a GROUP BY a.isactive")
    List<CountReport> countByActiveStatus();

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(" +
            "CASE WHEN a.isactive = 1 THEN 'Active' ELSE 'Inactive' END, COUNT(a.id)) " +
            "FROM Announcement a " +
            "WHERE a.publishedat BETWEEN :start AND :end " +
            "GROUP BY a.isactive")
    List<CountReport> countByActiveStatusBetweenDates(@Param("start") Timestamp start,
                                                      @Param("end") Timestamp end);
}