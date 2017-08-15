package com.dji.GSDemo.GoogleMap.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by lasithniro on 12/31/16.
 */

@JsonIgnoreProperties(ignoreUnknown = true)
public class Mission {
    private String name;
    private String data;

    public Mission() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
