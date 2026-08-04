package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CitizenstatusReportDao extends JpaRepository<Citizen, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(cs.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.citizenstatus cs GROUP BY cs.id, cs.name")
    List<CountReport> countByCitizenstatus();
}