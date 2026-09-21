package com.incidentflow.incidentflow.dto;

public class DashboardResponse {

    private long totalIncidents;
    private long openIncidents;
    private long inProgressIncidents;
    private long resolvedIncidents;
    private long closedIncidents;

    private long criticalIncidents;
    private long highIncidents;
    private long mediumIncidents;
    private long lowIncidents;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalIncidents,
            long openIncidents,
            long inProgressIncidents,
            long resolvedIncidents,
            long closedIncidents,
            long criticalIncidents,
            long highIncidents,
            long mediumIncidents,
            long lowIncidents) {

        this.totalIncidents = totalIncidents;
        this.openIncidents = openIncidents;
        this.inProgressIncidents = inProgressIncidents;
        this.resolvedIncidents = resolvedIncidents;
        this.closedIncidents = closedIncidents;
        this.criticalIncidents = criticalIncidents;
        this.highIncidents = highIncidents;
        this.mediumIncidents = mediumIncidents;
        this.lowIncidents = lowIncidents;
    }

    public long getTotalIncidents() {
        return totalIncidents;
    }

    public void setTotalIncidents(long totalIncidents) {
        this.totalIncidents = totalIncidents;
    }

    public long getOpenIncidents() {
        return openIncidents;
    }

    public void setOpenIncidents(long openIncidents) {
        this.openIncidents = openIncidents;
    }

    public long getInProgressIncidents() {
        return inProgressIncidents;
    }

    public void setInProgressIncidents(long inProgressIncidents) {
        this.inProgressIncidents = inProgressIncidents;
    }

    public long getResolvedIncidents() {
        return resolvedIncidents;
    }

    public void setResolvedIncidents(long resolvedIncidents) {
        this.resolvedIncidents = resolvedIncidents;
    }

    public long getClosedIncidents() {
        return closedIncidents;
    }

    public void setClosedIncidents(long closedIncidents) {
        this.closedIncidents = closedIncidents;
    }

    public long getCriticalIncidents() {
        return criticalIncidents;
    }

    public void setCriticalIncidents(long criticalIncidents) {
        this.criticalIncidents = criticalIncidents;
    }

    public long getHighIncidents() {
        return highIncidents;
    }

    public void setHighIncidents(long highIncidents) {
        this.highIncidents = highIncidents;
    }

    public long getMediumIncidents() {
        return mediumIncidents;
    }

    public void setMediumIncidents(long mediumIncidents) {
        this.mediumIncidents = mediumIncidents;
    }

    public long getLowIncidents() {
        return lowIncidents;
    }

    public void setLowIncidents(long lowIncidents) {
        this.lowIncidents = lowIncidents;
    }
}