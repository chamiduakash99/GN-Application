package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import java.sql.Date;
import java.util.List;

public interface CitizenstatusReportDao extends JpaRepository<Citizen, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(cs.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.citizenstatus cs GROUP BY cs.id, cs.name")
    List<CountReport> countByCitizenstatus();

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(cs.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.citizenstatus cs " +
            "WHERE (:dobFrom IS NULL OR c.dateofbirth >= :dobFrom) AND (:dobTo IS NULL OR c.dateofbirth <= :dobTo) AND (:genderId IS NULL OR c.gender.id = :genderId) AND (:statusId IS NULL OR c.citizenstatus.id = :statusId) " +
            "GROUP BY cs.id, cs.name")
    List<CountReport> countByCitizenstatusFiltered(@Param("dobFrom") Date dobFrom,
                                          @Param("dobTo") Date dobTo,
                                          @Param("genderId") Integer genderId,
                                          @Param("statusId") Integer statusId);

}