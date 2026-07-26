package lk.earth.earthuniversity.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

public class LandReport {

    private Integer id;
    private String landtype;
    private Long count;
    private double percentage;

    public LandReport() { }

    public LandReport(String landtype, Long count) {
        this.landtype = landtype;
        this.count = count;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getlandtype() {
        return landtype;
    }

    public void setlandtype(String landtype) {
        this.landtype = landtype;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
