package lk.earth.earthuniversity.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

public class CountByStreetMaterial {

    private Integer id;
    private String streetMaterial;
    private Long count;
    private double percentage;

    public CountByStreetMaterial() { }

    public CountByStreetMaterial(String streetMaterial, Long count) {
        this.streetMaterial = streetMaterial;
        this.count = count;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStreetMaterial() {
        return streetMaterial;
    }

    public void setStreetMaterial(String streetMaterial) {
        this.streetMaterial = streetMaterial;
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
