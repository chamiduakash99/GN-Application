package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import java.sql.Date;
import java.util.List;

public interface ReligionReportDao extends JpaRepository<Citizen, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(r.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.religion r GROUP BY r.id, r.name")
    List<CountReport> countByReligion();

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(r.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.religion r " +
            "WHERE (:dobFrom IS NULL OR c.dateofbirth >= :dobFrom) AND (:dobTo IS NULL OR c.dateofbirth <= :dobTo) AND (:genderId IS NULL OR c.gender.id = :genderId) AND (:statusId IS NULL OR c.citizenstatus.id = :statusId) " +
            "GROUP BY r.id, r.name")
    List<CountReport> countByReligionFiltered(@Param("dobFrom") Date dobFrom,
                                          @Param("dobTo") Date dobTo,
                                          @Param("genderId") Integer genderId,
                                          @Param("statusId") Integer statusId);

}