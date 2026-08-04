package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MatiralstatusReportDao extends JpaRepository<Citizen, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(ms.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.matiralstatus ms GROUP BY ms.id, ms.name")
    List<CountReport> countByMatiralstatus();
}