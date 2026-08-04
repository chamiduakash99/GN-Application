package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Landdetail;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LandReportDao extends JpaRepository<Landdetail, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(lt.name, COUNT(l.id)) " +
            "FROM Landdetail l JOIN l.landtype lt GROUP BY lt.id, lt.name")
    List<CountReport> countByLandType();
}