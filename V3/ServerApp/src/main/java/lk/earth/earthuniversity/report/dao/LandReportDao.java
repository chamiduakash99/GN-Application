package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Landdetail;
import lk.earth.earthuniversity.entity.Street;
import lk.earth.earthuniversity.report.entity.LandReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LandReportDao extends JpaRepository<Landdetail, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.LandReport(lt.name, COUNT(l.id)) " +
            "FROM Landdetail l JOIN l.landtype lt GROUP BY lt.id, lt.name")
    List<LandReport> countByLandType();

}
