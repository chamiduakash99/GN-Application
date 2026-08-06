package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import java.sql.Date;
import java.util.List;

public interface EducationlevelReportDao extends JpaRepository<Citizen, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(el.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.educationlevel el GROUP BY el.id, el.name")
    List<CountReport> countByEducationlevel();

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(el.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.educationlevel el " +
            "WHERE (:dobFrom IS NULL OR c.dateofbirth >= :dobFrom) AND (:dobTo IS NULL OR c.dateofbirth <= :dobTo) AND (:genderId IS NULL OR c.gender.id = :genderId) AND (:statusId IS NULL OR c.citizenstatus.id = :statusId) " +
            "GROUP BY el.id, el.name")
    List<CountReport> countByEducationlevelFiltered(@Param("dobFrom") Date dobFrom,
                                          @Param("dobTo") Date dobTo,
                                          @Param("genderId") Integer genderId,
                                          @Param("statusId") Integer statusId);

}