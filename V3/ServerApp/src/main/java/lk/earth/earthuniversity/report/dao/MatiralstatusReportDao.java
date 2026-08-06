package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import java.sql.Date;
import java.util.List;

public interface MatiralstatusReportDao extends JpaRepository<Citizen, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(ms.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.matiralstatus ms GROUP BY ms.id, ms.name")
    List<CountReport> countByMatiralstatus();

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(ms.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.matiralstatus ms " +
            "WHERE (:dobFrom IS NULL OR c.dateofbirth >= :dobFrom) AND (:dobTo IS NULL OR c.dateofbirth <= :dobTo) AND (:genderId IS NULL OR c.gender.id = :genderId) AND (:statusId IS NULL OR c.citizenstatus.id = :statusId) " +
            "GROUP BY ms.id, ms.name")
    List<CountReport> countByMatiralstatusFiltered(@Param("dobFrom") Date dobFrom,
                                          @Param("dobTo") Date dobTo,
                                          @Param("genderId") Integer genderId,
                                          @Param("statusId") Integer statusId);

}