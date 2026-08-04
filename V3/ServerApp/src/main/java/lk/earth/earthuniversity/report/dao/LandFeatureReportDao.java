package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.LandfeatureHasLanddetail;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LandFeatureReportDao extends JpaRepository<LandfeatureHasLanddetail, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(lf.name, COUNT(lhd.id)) " +
            "FROM LandfeatureHasLanddetail lhd " +
            "JOIN lhd.landfeature lf " +
            "GROUP BY lf.id, lf.name")
    List<CountReport> countByLandFeature();
}