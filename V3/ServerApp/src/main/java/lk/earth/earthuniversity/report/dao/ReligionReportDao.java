package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.entity.Citizen;
import lk.earth.earthuniversity.report.entity.CountReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReligionReportDao extends JpaRepository<Citizen, Integer> {

    @Query("SELECT NEW lk.earth.earthuniversity.report.entity.CountReport(r.name, COUNT(c.id)) " +
            "FROM Citizen c JOIN c.religion r GROUP BY r.id, r.name")
    List<CountReport> countByReligion();
}