package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Landdetail;
import lk.earth.earthuniversity.report.entity.FenceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FenceReportDao extends JpaRepository<Landdetail, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.FenceReport(ft.name, COUNT(l.id)) " +
            "FROM Landdetail l JOIN l.fencetype ft GROUP BY ft.id, ft.name")
    List<FenceReport> countByFenceType();

}