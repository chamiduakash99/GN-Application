package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingDao extends JpaRepository<Building, Integer> {

    // Find building by number
    Building findByNo(String no);

}