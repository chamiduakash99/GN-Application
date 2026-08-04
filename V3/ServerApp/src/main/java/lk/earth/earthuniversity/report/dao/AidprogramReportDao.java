package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizenaidprogram;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AidprogramReportDao extends JpaRepository<Citizenaidprogram, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(ap.name, COUNT(cap.id)) " +
            "FROM Citizenaidprogram cap JOIN cap.aidprogram ap GROUP BY ap.id, ap.name")
    List<CountReport> countByAidprogram();
}