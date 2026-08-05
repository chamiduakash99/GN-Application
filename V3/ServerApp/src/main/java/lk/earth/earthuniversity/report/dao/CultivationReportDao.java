package lk.earth.earthuniversity.report.dao;

import lk.earth.earthuniversity.report.entity.CountByDesignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByDesignaitonDao extends JpaRepository<CountByDesignation,Integer> {

    @Query(value = "SELECT NEW CountByDesignation(d.name, COUNT(e.fullname)) FROM Employee e, Designation d WHERE e.designation.id = d.id GROUP BY d.id")
    List<CountByDesignation> countByDesignation();

}





















//File	Action
//report/dao/RoadReportDao.java	New file. One interface, one @Query returning List<CountReport>
// (copy any existing DAO, change the join field)
//ReportController.java	Edit. Add @Autowired RoadReportDao field + one @GetMapping endpoint calling withPercentages(...)
//
//That's it on backend — no new entity file, CountReport is reused.
//
//Frontend — 2 things to touch
//File	Action
//landreport.component.ts (or wherever this new chart lives)
// Edit. Add a roadreports/roadData/columns/binders block + loadRoadData()/drawRoadCharts() (copy the fence-type block, rename)
//landreport.component.html	Edit. Add one new table mat-grid-tile + one chart mat-grid-tile block,
// reusing name/percentage/count binders
//
