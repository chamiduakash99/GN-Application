package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Gnd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GndDao extends JpaRepository<Gnd, Integer> {

    Gnd findByName(String name);
}
