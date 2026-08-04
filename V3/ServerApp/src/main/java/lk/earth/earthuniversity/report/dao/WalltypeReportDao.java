package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Building;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WalltypeReportDao extends JpaRepository<Building, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(wt.name, COUNT(b.id)) " +
            "FROM Building b JOIN b.walltype wt GROUP BY wt.id, wt.name")
    List<CountReport> countByWalltype();
}