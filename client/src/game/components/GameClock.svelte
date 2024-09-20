<script lang="ts">
    export let currentTime: number
    const defaultTime: number = 60

    let d = 100
    let o = -0.5 * d
    let sw = 0.1 * d
    let r = 0.5 * (d - sw)

    $: {
        const percentage = currentTime / defaultTime
        document.documentElement.style.setProperty('--k', percentage.toString())
        document.documentElement.style.setProperty('--t', currentTime.toString())
    }

    $: displayTime = formatTime(currentTime)

    function formatTime(time: number) {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes}:${String(seconds).padStart(2, '0')}`
    }
</script>

<div class="countdown">
    <svg viewBox="{`${o} ${o} ${d} ${d}`}" stroke-width="{sw}">
        <circle {r}></circle>
        <circle {r} pathLength="1" style="stroke-dashoffset: calc(1 - var(--k))"></circle>
    </svg>
    <div class="time-display">{displayTime}</div>
</div>

<style lang="scss">
    $d: 8rem;
    $c: #8a9b0f #940a3d;

    @property --t {
        syntax: '<number>';
        initial-value: 60;
        inherits: true;
    }
    @property --k {
        syntax: '<number>';
        initial-value: 1;
        inherits: true;
    }

    .countdown {
        display: grid;
        margin: 0.5rem 2rem;
        width: $d;
        height: $d;
        position: relative;

        .time-display {
            grid-column: 1;
            grid-row: 1;
            place-self: center;
            font:
                #{0.25 * $d}/ 2 ubuntu mono,
                consolas,
                monaco,
                monospace;
            font-size: 2rem;
        }
    }

    svg {
        grid-column: 1;
        grid-row: 1;
        transform: rotate(-90deg);
    }

    [r] {
        fill: none;
        stroke: silver;
        transition: stroke-dashoffset 1s linear;

        + [r] {
            stroke-linecap: round;
            stroke: color-mix(in hsl shorter hue, #{nth($c, 1)} calc(var(--k) * 100%), #{nth($c, 2)});
            stroke-dasharray: 1;
            stroke-dashoffset: calc(1 - var(--k));
            transition: stroke-dashoffset 1s linear;
        }
    }
</style>
