package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizenaidprogram;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;
import java.sql.Date;
import java.util.List;

public interface AidprogramReportDao extends JpaRepository<Citizenaidprogram, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(ap.name, COUNT(cap.id)) " +
            "FROM Citizenaidprogram cap JOIN cap.aidprogram ap GROUP BY ap.id, ap.name")
    List<CountReport> countByAidprogram();

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(ap.name, COUNT(cap.id)) " +
            "FROM Citizenaidprogram cap JOIN cap.citizen c JOIN cap.aidprogram ap " +
            "WHERE (:dobFrom IS NULL OR c.dateofbirth >= :dobFrom) AND (:dobTo IS NULL OR c.dateofbirth <= :dobTo) AND (:genderId IS NULL OR c.gender.id = :genderId) AND (:statusId IS NULL OR c.citizenstatus.id = :statusId) " +
            "GROUP BY ap.id, ap.name")
    List<CountReport> countByAidprogramFiltered(@Param("dobFrom") Date dobFrom,
                                          @Param("dobTo") Date dobTo,
                                          @Param("genderId") Integer genderId,
                                          @Param("statusId") Integer statusId);

}